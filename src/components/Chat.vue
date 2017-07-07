<template>
  <div class="hello">
    <transition name="slide">
      <div v-if="isChatVisible" class="col-xs-5 col-sm-4 col-md-3 chat-panel">
        <div v-for="message in messages" class="well"
          :class="{msgFromOther: message.user != currentUser}">
          <h5>{{message.user}}<small>{{message.time}}</small></h5>
          <small>{{message.text}}</small>
        </div>
        <form>
          <div class="input-group">
              <input class="form-control" type="text"
                placeholder="メッセージを入力してください" v-model="newMsg">
              <span class="input-group-btn">
                <input class="btn btn-primary" type="submit"
                  value="送信" v-on:click="addMsg">
              </span>
          </div>
        </form>
      </div>
    </transition>
      <button class="chat-btn btn btn-primary" v-on:click="toggleChat">{{isChatVisible ? '<' : '>'}}</button>

  </div>
</template>

<script>
export default {
  name: 'chat',
  data () {
    return {
      newMsg: '',
      currentUser: 'Gergo',
      messages: [{
        user: 'Natsuko',
        text: 'Szia Gergo!',
        time: new Date().toLocaleString()
      },
      {
        user: 'Gergo',
        text: 'Szevasz!',
        time: new Date().toLocaleString()
      },
      {
        user: 'Natsuko',
        text: 'Mizu?',
        time: new Date().toLocaleString()
      }],
      isChatVisible: false
    }
  },
  methods: {
    addMsg: function (e) {
      e.preventDefault();
      this.messages.push({
        user: this.currentUser,
        text: this.newMsg,
        time: new Date().toLocaleString()
      });
      this.newMsg = '';
    },
    toggleChat: function() {
      this.isChatVisible = !this.isChatVisible;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chat-panel {
    background-color: LightGray;
    height: 90vh;
    overflow-y: scroll;
  }

  .chat-btn {
    height: 90vh;
    color: white;
    font-weight: bold;
  }

  .msgFromOther {
    text-align: right;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .2s
  }
  .slide-enter, .slide-leave-to  {
    transform: translateX(-100%);
  }
  .slide-move {
    transition: transform 1s;
  }
</style>
