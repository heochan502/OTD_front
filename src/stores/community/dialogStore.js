import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    open: false,
    mode: 'alert',
    title: '',
    message: '',
    confirmText: '확인',
    cancelText: '취소',
    resolveFn: null,
  }),
  actions: {
    alert({ title = '알림', message = '', confirmText = '확인' } = {}) {
      this.mode = 'alert';
      this.title = title;
      this.message = message;
      this.confirmText = confirmText;
      this.open = true;
      return new Promise((resolve) => {
        this.resolveFn = () => {
          this.open = false;
          resolve(true);
        };
      });
    },
    confirm({
      title = '확인',
      message = '',
      confirmText = '확인',
      cancelText = '취소',
    } = {}) {
      this.mode = 'confirm';
      this.title = title;
      this.message = message;
      this.confirmText = confirmText;
      this.cancelText = cancelText;
      this.open = true;
      return new Promise((resolve) => {
        this.resolveFn = (v) => {
          this.open = false;
          resolve(v);
        };
      });
    },
    onConfirm() {
      if (this.resolveFn) this.resolveFn(true);
      this.reset();
    },
    onCancel() {
      if (this.mode === 'confirm' && this.resolveFn) this.resolveFn(false);
      this.reset();
    },
    reset() {
      this.resolveFn = null;
      this.mode = 'alert';
      this.title = '';
      this.message = '';
    },
  },
});
