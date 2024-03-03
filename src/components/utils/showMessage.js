const showMessage = (message) => {
  const log = document.getElementById("log");
  const newMessage = document.createElement("div");
  
  const currentTime = new Date().toLocaleTimeString(); // Get current time
  const messageWithTime = `${currentTime}: ${message}`; // Combine time and message
  
  newMessage.textContent = messageWithTime;
  log.insertBefore(newMessage, log.firstChild);
};

export default showMessage;
