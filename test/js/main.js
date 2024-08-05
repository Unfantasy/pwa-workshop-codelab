const APP_URL = 'https://baidu.com';
/*
 Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
// 注册 Service worker
class Install {
  /**
   * @param {DOMElement} trigger - Triggering element
   */
  constructor(trigger) {
    this._prompt;
    this._trigger = trigger;
  }

  /**
   * Toggle visibility of install button
   * @param {string} action
   */
  toggleInstallButton(action = 'hide') {
    if (action === 'hide') {
      this._trigger.style.display = 'none';
    } else {
      this._trigger.style.display = 'block';
    }
  }
}

// Register the service worker
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // Try to register the service worker.
    try {
      const reg = await navigator.serviceWorker.register('../service-worker.js');
      hideLoading();
      console.log('Service worker registered! 😎', reg);
    } catch (err) {
      hideLoading();
      console.log('😥 Service worker registration failed: ', err);
    }
  });
} else {
  hideLoading();
}

window.addEventListener('DOMContentLoaded', async () => {
  // Set up install prompt
  console.log('service worker DOMContentLoaded');

  // new Install(document.querySelector('#btn-install'));
});

var installPromptEvent = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // Chrome <= 67 可以阻止显示
  console.log(event, 'beforeinstallprompt');
  installPromptEvent = event; // 拿到事件的引用
  // document.querySelector('#btn-install').disabled = false; // 更新安装 UI，通知用户可以安装
});

// 安装按钮
document.querySelector('#btn-install').addEventListener('click', () => {
  if (!installPromptEvent) {
    return;
  }
  console.log(installPromptEvent, 'installPromptEvent');
  installPromptEvent.prompt();
  installPromptEvent.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('用户已同意添加到桌面');
    } else {
      console.log('用户已取消添加到桌面');
    }
  });
});

// 已安装按钮
document.querySelector('#btn-installed').addEventListener('click', () => {
  window.open(APP_URL);
});

// 是否已经安装到桌面
window.addEventListener('appinstalled', (evt) => {
  console.log('appinstalled');
  // localStorage.setItem('pwaAPP', 'testPwa');
  $('#btn-installed').css('display', 'flex');
  $('#btn-install').hide();
});

// // 是否已经安装到桌面
// if (localStorage.getItem('pwaAPP') === 'testPwa') {
//   $('#btn-installed').show();
//   $('#btn-install').hide();
// }

// 通过桌面图标打开的直接进入对应链接
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('display-mode 是 standalone', 'xyxyxyyxyxyyx');
  window.location.replace(APP_URL);
} else {
  console.log($('#container'), 'xxxxx');
  $('#container').show();
}

// // safari 浏览器直接打开 appUrl
// if (navigator.userAgent.indexOf('Safari') !== -1) {
//   window.location.replace(APP_URL);
// }

// 判断是否第一次打开该页面，如果是第一次打开该页面

console.log('mainjs 执行中');
showLoading();

function hideLoading() {
  // 如果缓存 loadingTime 与当前时间戳差小于2000 则等待至2000ms后再执行操作
  const timeDiff = new Date().getTime() - (sessionStorage.getItem('loadingTime') || 0);
  console.log(timeDiff, 'timeDiff');
  if (timeDiff < 3000) {
    setTimeout(() => {
      $('#rb-loading').removeClass('loading--show');
    }, 3000 - timeDiff);
    return;
  }

  $('#rb-loading').removeClass('loading--show');
}
function showLoading() {
  // 设置缓存 loadingTime 为当前时间戳
  sessionStorage.setItem('loadingTime', new Date().getTime());
  $('#rb-loading').addClass('loading--show');
}
