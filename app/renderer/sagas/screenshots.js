import * as eff from 'redux-saga/effects';
import fs from 'fs';
import path from 'path';
import {
  remote,
  desktopCapturer,
} from 'electron';
import mergeImages from 'merge-images';
import screenshot from 'screenshot-desktop';
import {
  actionTypes,
} from 'actions';

import {
  throwError,
} from './ui';

const { app } = remote.require('electron');


function getScreen(callback) {
  const screenshots = [];

  function handleStream(stream, finalScreenshot) {
    // Create hidden video tag
    const video = document.createElement('video');
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
    // Event connected to stream
    video.onloadedmetadata = () => {
      // Set video ORIGINAL height (screenshot)
      video.style.height = `${video.videoHeight}px`; // videoHeight
      video.style.width = `${video.videoWidth}px`; // videoWidth

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      screenshots.push(canvas.toDataURL('image/jpeg'));

      if (callback) {
        // Save screenshot to jpg - base64
        if (finalScreenshot) {
          callback(screenshots);
        }
      } else {
        // console.log('Need callback!');
      }

      // Remove hidden video tag
      video.remove();
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {
        // console.log(e);
      }
    };
    video.src = URL.createObjectURL(stream);
    document.body.appendChild(video);
  }

  function handleError(e) {
    console.log(e);
  }

  desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
    if (error) throw error;
    for (let i = 0; i < sources.length; i += 1) {
      const finalScreenshot = i === sources.length - 1;
      navigator.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[i].id,
            maxWidth: window.screen.width,
            minWidth: window.screen.width,
            maxHeight: window.screen.height,
            minHeight: window.screen.height,
          },
        },
      }, stream => handleStream(stream, finalScreenshot), handleError);
    }
  });
}

function makeScreenshot() {
  return new Promise((resolve, reject) => {
    getScreen((images) => {
      console.log(images[0]);
      let xPointer = 0;
      let totalWidth = 0;
      let maxHeight = 0;
      const imagesWithCords = images.map((imageSrc) => {
        const image = new Image();
        image.src = imageSrc;
        const imageObj = {
          src: imageSrc,
          x: xPointer,
          y: 0,
        };
        xPointer = image.naturalWidth + xPointer;
        totalWidth += image.naturalWidth;
        maxHeight = image.naturalHeight > maxHeight ? image.naturalHeight : maxHeight;
        return imageObj;
      });
      const now = Date.now();
      const screenshotName = `${now}`;
      mergeImages(
        imagesWithCords,
        {
          width: totalWidth,
          height: maxHeight,
          format: 'image/jpeg',
          quality: 0.9,
        },
      )
        .then(
          (merged, err) => {
            // Scren thumb
            /*
            const canvas = window.document.createElement('canvas');
            const context = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
              context.drawImage(img, 0, 0, 300, 150);
              const thumb = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
              const thumbImageDir = `${remote.getGlobal('appDir')}/screens/${screenshotName}_thumb.jpeg`;
              fs.writeFile(thumbImageDir, thumb, 'base64');
              remote.getGlobal('sharedObj').lastScreenshotThumbPath = thumbImageDir;
            };
            img.src = merged;
            */

            // Screen
            const validImage = merged.replace(/^data:image\/jpeg;base64,/, '');
            const imageDir = `${app.getPath('userData')}/screens/${screenshotName}.jpeg`;

            function ensureDirectoryExistence(filePath) {
              const dirname = path.dirname(filePath);
              if (!fs.existsSync(dirname)) {
                ensureDirectoryExistence(dirname);
                fs.mkdirSync(dirname);
              }
            }

            ensureDirectoryExistence(imageDir);
            fs.writeFile(imageDir, validImage, 'base64', (err) => {
              if (err) reject();
              resolve(imageDir);
            });
          },
        ).catch((e) => {
          console.log(e);
        });
    });
  });
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }
}

function loadImage(buf) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = `data:image/jpeg;base64,${buf.toString('base64')}`;
    img.addEventListener(
      'load',
      () => {
        const imageObj = {
          src,
          y: 0,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        };
        resolve(imageObj);
      },
    );
    img.addEventListener('error', () => {
      reject(new Error(`Failed to load image's URL: ${buf}`));
    });
    img.src = src;
  });
}

export function* takeScreenshotRequest() {
  while (true) {
    const { isTest } = yield eff.take(actionTypes.TAKE_SCREENSHOT_REQUEST);
    try {
      console.log(isTest);
      const displays = yield eff.call(screenshot.listDisplays);
      const images = yield eff.all(
        displays.map(
          d => eff.call(
            screenshot,
            {
              screen: d.id,
            },
          ),
        ),
      );
      const imgs = yield eff.all(images.map(
        i => eff.call(
          loadImage,
          i,
        ),
      ));
      const width = imgs.reduce(
        (acc, i) => (
          acc + i.naturalWidth
        ),
        0,
      );
      const height = imgs.reduce(
        (acc, i) => (
          acc > i.naturalHeight ? acc : i.naturalHeight
        ),
        0,
      );
      const mergedImages = yield eff.call(
        mergeImages,
        imgs.reduce(
          (acc, i) => ({
            xPointer: acc.xPointer + i.naturalWidth,
            imgs: [
              ...acc.imgs,
              {
                ...i,
                x: acc.xPointer,
              },
            ],
          }),
          {
            xPointer: 0,
            imgs: [],
          },
        ).imgs,
        {
          width,
          height,
          format: 'image/jpeg',
          quality: 0.9,
        },
      );
      const validImage = mergedImages.replace(/^data:image\/jpeg;base64,/, '');
      const imageDir = `${app.getPath('userData')}/screens/2.jpeg`;

      ensureDirectoryExistence(imageDir);
      fs.writeFile(imageDir, validImage, 'base64', (err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
      yield eff.call(throwError, err);
    }
  }
}
