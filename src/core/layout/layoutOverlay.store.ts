import { defineStore } from "pinia";
import { markRaw } from "vue";

type OverlayPayload = {
  component?: any;
  props?: Record<string, any>;
  title?: string;
};

type OverlayState = {
  seq: number;
  left: {
    open: boolean;
    key: number;
    title?: string;
    component: any | null;
    props: Record<string, any>;
  };
  right: {
    open: boolean;
    key: number;
    title?: string;
    component: any | null;
    props: Record<string, any>;
  };
  dialog: {
    open: boolean;
    key: number;
    component: any | null;
    props: Record<string, any>;
    title?: string;
  };
};

export const useLayoutOverlayStore = defineStore("layoutOverlay", {
  state: (): OverlayState => ({
    seq: 0,
    left: { open: false, key: 0, title: undefined, component: null, props: {} },
    right: {
      open: false,
      key: 0,
      title: undefined,
      component: null,
      props: {},
    },
    dialog: {
      open: false,
      key: 0,
      component: null,
      props: {},
      title: undefined,
    },
  }),

  actions: {
    openLeft(payload: OverlayPayload) {
      this.seq += 1;
      this.left.key = this.seq;
      this.left.title = payload.title;
      this.left.component = payload.component
        ? markRaw(payload.component)
        : null;
      this.left.props = payload.props ?? {};
      this.left.open = true;
    },
    closeLeft() {
      this.left.open = false;
      this.left.title = undefined;
      this.left.component = null;
      this.left.props = {};
    },

    openRight(payload: OverlayPayload) {
      this.seq += 1;
      this.right.key = this.seq;
      this.right.title = payload.title;
      this.right.component = payload.component
        ? markRaw(payload.component)
        : null;
      this.right.props = payload.props ?? {};
      this.right.open = true;
    },
    closeRight() {
      this.right.open = false;
      this.right.title = undefined;
      this.right.component = null;
      this.right.props = {};
    },

    openDialog(payload: OverlayPayload) {
      this.seq += 1;
      this.dialog.key = this.seq;
      this.dialog.title = payload.title;
      this.dialog.component = payload.component
        ? markRaw(payload.component)
        : null;
      this.dialog.props = payload.props ?? {};
      this.dialog.open = true;
    },
    closeDialog() {
      this.dialog.open = false;
      this.dialog.title = undefined;
      this.dialog.component = null;
      this.dialog.props = {};
    },

    closeAll() {
      this.closeLeft();
      this.closeRight();
      this.closeDialog();
    },
  },
});
