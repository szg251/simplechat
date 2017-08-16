<template lang="html">

  <div class="overlay" v-if="visible">
    <div class="dialog-box">
      <div class="dialog-box-header">
        {{dialogData.title}}
      </div>
      <div class="dialog-box-body">
        {{dialogData.message}}
      </div>
      <div class="dialog-box-footer">
        <div class="form-group">
          <a v-if="dialogData.buttons.yes" class="btn btn-primary btn-lg" @click="yes">Yes</a>
          <a v-if="dialogData.buttons.dangerYes" class="btn btn-danger btn-lg" @click="yes">Yes</a>
          <a v-if="dialogData.buttons.no" class="btn btn-default btn-lg" @click="no">No</a>
          <a v-if="dialogData.buttons.ok" class="btn btn-primary btn-lg" @click="ok">OK</a>
          <a v-if="dialogData.buttons.cancel" class="btn btn-default btn-lg" @click="cancel">Cancel</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import dialogBus from './DialogBus'

export default {
  name: 'dialog-box',
  data() {
    return {
      visible: false,
      dialogData: {}
    }
  },
  methods: {
    yes () {
      dialogBus.$emit('dialog-response', {name: this.dialogData.name, answer: 'yes'});
      this.dialogData = {};
      this.visible = false;
    },
    no () {
      dialogBus.$emit('dialog-response', {name: this.dialogData.name, answer: 'no'});
      this.dialogData = {};
      this.visible = false;
    },
    cancel () {
      dialogBus.$emit('dialog-response', {name: this.dialogData.name, answer: 'cancel'});
      this.dialogData = {};
      this.visible = false;
    },
    ok () {
      dialogBus.$emit('dialog-response', {name: this.dialogData.name, answer: 'ok'});
      this.dialogData = {};
      this.visible = false;
    }
  },
  created() {
    dialogBus.$on('dialog-request', dialogData => {
      this.visible = true;
      this.dialogData = dialogData;
    })
  }
}
</script>

<style lang="css" scoped>
  .overlay {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    height: 100vh;
    width: 100vw;
    z-index: 1100;
  }

  .dialog-box {
    height: 200px;
    width: 400px;
    position: relative;
    top: calc(50vh - 100px);
    margin: auto;
    background-color: white;
    color: black;
    z-index: 1110;
    border-radius: 5px;
    box-shadow: 0 0 50px;
  }

  .dialog-box-header {
    text-align: center;
    font-size: x-large;
    border-bottom: 1px solid #bbb;
    margin-bottom: 20px;
  }

  .dialog-box-body {
    text-align: center;
    font-size: large;
  }

  .dialog-box-footer {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 0px;
  }
</style>
