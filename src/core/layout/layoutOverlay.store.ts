import { defineStore } from 'pinia'
import { markRaw } from 'vue'

type OverlayPayload = {
  component?: any
  props?: Record<string, any>
  title?: string
}

type OverlayState = {
  left: { open: boolean; component: any | null; props: Record<string, any> }
  right: { open: boolean; component: any | null; props: Record<string, any> }
  dialog: { open: boolean; component: any | null; props: Record<string, any>; title?: string }
}

export const useLayoutOverlayStore = defineStore('layoutOverlay', {
  state: (): OverlayState => ({
    left: { open: false, component: null, props: {} },
    right: { open: false, component: null, props: {} },
    dialog: { open: false, component: null, props: {}, title: undefined },
  }),

  actions: {
    openLeft(payload: OverlayPayload) {
      this.left.component = payload.component ? markRaw(payload.component) : null
      this.left.props = payload.props ?? {}
      this.left.open = true
    },
    closeLeft() {
      this.left.open = false
      this.left.component = null
      this.left.props = {}
    },

    openRight(payload: OverlayPayload) {
      this.right.component = payload.component ? markRaw(payload.component) : null
      this.right.props = payload.props ?? {}
      this.right.open = true
    },
    closeRight() {
      this.right.open = false
      this.right.component = null
      this.right.props = {}
    },

    openDialog(payload: OverlayPayload) {
      this.dialog.title = payload.title
      this.dialog.component = payload.component ? markRaw(payload.component) : null
      this.dialog.props = payload.props ?? {}
      this.dialog.open = true
    },
    closeDialog() {
      this.dialog.open = false
      this.dialog.title = undefined
      this.dialog.component = null
      this.dialog.props = {}
    },

    closeAll() {
      this.closeLeft()
      this.closeRight()
      this.closeDialog()
    },
  },
})
