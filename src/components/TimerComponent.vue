<template>
    <div class="timer-component">
      <h2>Online Timer</h2>
      <div class="timer-display">
        {{ formattedTime.hours }}:{{ formattedTime.minutes }}:{{ formattedTime.seconds }}
      </div>
      <div class="buttons">
        <button @click="startTimer" v-if="!isRunning && !isPaused">Start</button>
        <button @click="pauseTimer" v-if="isRunning">Pause</button>
        <button @click="resumeTimer" v-if="!isRunning && isPaused">Resume</button>
        <button @click="stopTimer" v-if="isRunning || isPaused">Stop</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        timer: null,
        isRunning: false,
        isPaused: false,
        socket: null, // WebSocket client instance
      };
    },
    computed: {
      formattedTime() {
        return {
          hours: this.padTime(this.hours),
          minutes: this.padTime(this.minutes),
          seconds: this.padTime(this.seconds),
        };
      },
    },
    methods: {
      startTimer() {
        this.isRunning = true;
        this.isPaused = false;
  
        // Notify the WebSocket server to start the timer
        this.socket.send(JSON.stringify({ action: 'start' }));
      },
      pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        clearInterval(this.timer);
  
        // Notify the WebSocket server to pause the timer
        this.socket.send(JSON.stringify({ action: 'pause' }));
      },
      resumeTimer() {
        this.isRunning = true;
        this.isPaused = false;
  
        // Notify the WebSocket server to resume the timer
        this.socket.send(JSON.stringify({ action: 'resume' }));
      },
      stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        this.resetTime();
  
        // Notify the WebSocket server to stop the timer
        this.socket.send(JSON.stringify({ action: 'stop' }));
      },
      incrementTime() {
        this.seconds++;
        if (this.seconds === 60) {
          this.seconds = 0;
          this.minutes++;
        }
        if (this.minutes === 60) {
          this.minutes = 0;
          this.hours++;
        }
      },
      resetTime() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      },
      padTime(value) {
        return value.toString().padStart(2, '0');
      },
    },
    mounted() {
      // Initialize WebSocket connection
      this.socket = new WebSocket('ws://localhost:8080'); // Update with your WebSocket server URL
  
      // Listen for messages from the WebSocket server
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.time) {
          // Update the timer state based on the WebSocket message
          this.hours = Math.floor(data.time / 3600);
          this.minutes = Math.floor((data.time % 3600) / 60);
          this.seconds = data.time % 60;
        }
  
        if (data.isRunning !== undefined) {
          this.isRunning = data.isRunning;
          this.isPaused = data.isPaused;
        }
      };
  
      // Handle WebSocket connection close
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    },
    beforeUnmount() {
      // Clean up WebSocket connection
      if (this.socket) {
        this.socket.close();
      }
    },
  };
  </script>
  
  <style scoped>
  .timer-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  
  .timer-display {
    font-size: 36px;
    margin-bottom: 20px;
  }
  
  .buttons {
    display: flex;
    justify-content: center;
  }
  
  button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:focus {
    outline: none;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  </style>
  