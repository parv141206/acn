(function () {
  /**
   * Validates an IPv4 address.
   * @param {string} ip - The IP address to validate.
   * @returns {boolean} - True if the IP address is valid, false otherwise.
   */
  function validateIp(ip) {
    const regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  }

  // Attach the function to the window object for global access
  window.validateIp = validateIp;
})();
