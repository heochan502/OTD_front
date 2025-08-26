<script setup>
import { storeToRefs } from 'pinia';
import { useDialogStore } from '@/stores/community/dialogStore';

const dialog = useDialogStore();
const { open, mode, title, message, confirmText, cancelText } =
  storeToRefs(dialog);
</script>

<template>
  <teleport to="body">
    <v-dialog v-model="open" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">{{
          title
        }}</v-card-title>
        <v-card-text class="text-body-2">{{ message }}</v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            v-if="mode === 'confirm'"
            variant="text"
            @click="dialog.onCancel()"
          >
            {{ cancelText }}
          </v-btn>
          <v-btn color="primary" variant="flat" @click="dialog.onConfirm()">
            {{ confirmText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </teleport>
</template>
