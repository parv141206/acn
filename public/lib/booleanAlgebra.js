(function () {
  /**
   * #####################
   * General Purpose
   * #####################
   */

  /**
   * @description Following function simply converts a binary such as '1000 0000' to 128. Only works with 8 bits
   *
   * @param {String} binary
   *
   */
  const toDecimal = (binary) => {
    return parseInt(binary, 2);
  };

  /**
   * @description From a whole 32 bit binary IP, it converts it to a normal decimal IP. The returned IP is dot separated
   * @param string binaryStr
   *
   */
  const toIpFromBinary = (binaryStr) => {
    // If the ip is . separated,
    binaryStr = binaryStr.split(".").join("");
    let firstOctet = toDecimal(binaryStr.substring(0, 8));
    let secondOctet = toDecimal(binaryStr.substring(8, 16));
    let thirdOctet = toDecimal(binaryStr.substring(16, 24));
    let fourthOctet = toDecimal(binaryStr.substring(24, 32));

    return (
      firstOctet.toString() +
      "." +
      secondOctet.toString() +
      "." +
      thirdOctet.toString() +
      "." +
      fourthOctet.toString()
    );
  };

  /**
   * @description Performs logical AND operation between 2 IPs. Expects IP in . separated decimal form. Returns in similar format
   * @param {string} ip1
   * @param {string} ip2
   */
  const decimalAnd = (ip1, ip2) => {
    const and_1 = parseInt(ip1.split(".")[0]) & parseInt(ip2.split(".")[0]);
    const and_2 = parseInt(ip1.split(".")[1]) & parseInt(ip2.split(".")[1]);
    const and_3 = parseInt(ip1.split(".")[2]) & parseInt(ip2.split(".")[2]);
    const and_4 = parseInt(ip1.split(".")[3]) & parseInt(ip2.split(".")[3]);

    return (
      and_1.toString() +
      "." +
      and_2.toString() +
      "." +
      and_3.toString() +
      "." +
      and_4.toString()
    );
  };

  /**
   * @description Same as above, but performs logical OR.
   * @param {string} ip1
   * @param {string} ip2
   * @returns
   */
  const decimalOr = (ip1, ip2) => {
    const or_1 = parseInt(ip1.split(".")[0]) | parseInt(ip2.split(".")[0]);
    const or_2 = parseInt(ip1.split(".")[1]) | parseInt(ip2.split(".")[1]);
    const or_3 = parseInt(ip1.split(".")[2]) | parseInt(ip2.split(".")[2]);
    const or_4 = parseInt(ip1.split(".")[3]) | parseInt(ip2.split(".")[3]);

    return (
      or_1.toString() +
      "." +
      or_2.toString() +
      "." +
      or_3.toString() +
      "." +
      or_4.toString()
    );
  };

  /**
   * @description Performs logical NOT operation on the given IP.
   * @param {string} ip1
   * @returns
   */
  const decimalComplement = (ip1) => {
    const octets = ip1.split(".");
    const complementedOctets = octets.map((octet) => {
      const binaryOctet = parseInt(octet, 10).toString(2).padStart(8, "0");
      const complementedBinaryOctet = binaryOctet
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("");
      return parseInt(complementedBinaryOctet, 2).toString(10);
    });

    return complementedOctets.join(".");
  };

  /**
   * @description This function converts a normal IP address which is in decimal to a binary IP address, separated by . total 32 bits
   * @param {string} ip
   * @returns
   */
  const toIpFromDecimal = (ip) => {
    const ipArray = ip.split(".");
    ipArray[0] = parseInt(ipArray[0], 10).toString(2).padStart(8, "0");
    ipArray[1] = parseInt(ipArray[1], 10).toString(2).padStart(8, "0");
    ipArray[2] = parseInt(ipArray[2], 10).toString(2).padStart(8, "0");
    ipArray[3] = parseInt(ipArray[3], 10).toString(2).padStart(8, "0");
    console.log(ipArray);

    return ipArray.join(".");
  };

  /**
   * #####################
   * CN specific
   * #####################
   */

  /**
   * @description From a slash notation value, creates a subnet mask. Returns decimal incarnation, such as 255.255.0.0
   * @param {number} cidr
   */
  const createSubnetMask = (cidr) => {
    // This subnet mask is in binary format, (32 bit binary separated by '.')
    let subnetMask = "";
    for (let i = 1; i <= 32; i++) {
      if (i <= cidr) {
        subnetMask += "1";
      } else {
        subnetMask += "0";
      }

      if (i % 8 === 0 && i !== 32) {
        subnetMask += ".";
      }
    }
    return toIpFromBinary(subnetMask);
  };

  /**
   * @description Just returns the network address
   * @param {string} ip
   * @param {string} subnetMask
   */
  const getNetworkAddress = (ip, subnetMask) => {
    return decimalAnd(ip, subnetMask);
  };

  /**
   * @description As the name suggests, returns subnet length. The input IP must be in decimal
   * @param {string} subnetMask
   * @returns
   */
  const getSubnetLength = (subnetMask) => {
    const binarySubnetMask = toIpFromDecimal(subnetMask);
    const subnetLength = Math.pow(2, binarySubnetMask.split("0").length - 1);
    return subnetLength;
  };

  /**
   * @description This function basically finds out how many octets are affected after finding out total number of hosts in each subnet.
   * This is just a utility function and doesn't have any practical SHOWCASE USE. Just used internally...
   * @param {number} subnetLength
   */
  const getNumberOfOctetsEffected = (subnetLength) => {
    let octetCounter = 1;
    while (subnetLength > 256) {
      octetCounter++;
      subnetLength /= 256;
    }
    return octetCounter;
  };

  const getNumberOfSubnets = (noOfOctets, subnetLength) => {
    return Math.pow(256, noOfOctets) / subnetLength;
  };

  /**
   * @description Look, as I am writing this, I am wondering how can I justify my code for this function. It's not perfect and I know that. I think it's kind of "understandable" if you think hard on it. GOD HAVE MERCY
   * @param {number} effectedOctets
   * @param {number} noOfSubnets
   * @param {number} noOfHosts
   * @param {string} netId
   * @param {string} subnetMask
   * @returns
   */
  const getSubnets = (
    effectedOctets,
    noOfSubnets,
    noOfHosts,
    netId,
    subnetMask
  ) => {
    // NOTE: read ____OctetValue from right, so in 192.168.12.12, 192 is 4th octet

    let res = [];
    if (effectedOctets === 1) {
      let firstOctetValue = 0;
      while (noOfSubnets !== 0) {
        let currentNetId =
          netId.split(".")[0] +
          "." +
          netId.split(".")[1] +
          "." +
          netId.split(".")[2] +
          "." +
          firstOctetValue;
        let broadcastId = decimalOr(
          currentNetId,
          decimalComplement(subnetMask)
        );
        let firstHostId =
          netId.split(".")[0] +
          "." +
          netId.split(".")[1] +
          "." +
          netId.split(".")[2] +
          "." +
          (firstOctetValue + 1);
        let lastHostId =
          broadcastId.split(".")[0] +
          "." +
          broadcastId.split(".")[1] +
          "." +
          broadcastId.split(".")[2] +
          "." +
          (parseInt(firstOctetValue) + parseInt(noOfHosts) - 2);
        res.push({
          netId: currentNetId,
          firstHostId: firstHostId,
          lastHostId: lastHostId,
          broadcastId: broadcastId,
        });
        firstOctetValue += noOfHosts;
        noOfSubnets--;
      }
    } else if (effectedOctets === 2) {
      let secondOctetValue = 0;
      while (noOfSubnets !== 0) {
        let currentNetId =
          netId.split(".")[0] +
          "." +
          netId.split(".")[1] +
          "." +
          secondOctetValue +
          "." +
          "0";
        let broadcastId = decimalOr(
          currentNetId,
          decimalComplement(subnetMask)
        );
        let firstHostId =
          netId.split(".")[0] +
          "." +
          netId.split(".")[1] +
          "." +
          secondOctetValue +
          "." +
          "1";
        let lastHostId =
          broadcastId.split(".")[0] +
          "." +
          broadcastId.split(".")[1] +
          "." +
          "254";
        res.push({
          netId: currentNetId,
          firstHostId: firstHostId,
          lastHostId: lastHostId,
          broadcastId: broadcastId,
        });
        secondOctetValue += noOfHosts / 256;
        noOfSubnets--;
      }
    } else if (effectedOctets === 3) {
      let thirdOctetValue = 0;
      while (noOfSubnets !== 0) {
        let currentNetId =
          netId.split(".")[0] + "." + thirdOctetValue + "." + "0" + "." + "0";
        let broadcastId = decimalOr(
          currentNetId,
          decimalComplement(subnetMask)
        );
        let firstHostId =
          netId.split(".")[0] + "." + thirdOctetValue + "." + "0" + "." + "1";
        let lastHostId =
          broadcastId.split(".")[0] +
          "." +
          broadcastId.split(".")[1] +
          "." +
          "255" +
          "." +
          "254";
        res.push({
          netId: currentNetId,
          firstHostId: firstHostId,
          lastHostId: lastHostId,
          broadcastId: broadcastId,
        });
        thirdOctetValue += noOfHosts / (256 * 256);
        noOfSubnets--;
      }
    } else if (effectedOctets === 4) {
      let fourthOctetValue = 0;
      while (noOfSubnets !== 0) {
        let currentNetId = fourthOctetValue + "." + "0" + "." + "0" + "." + "0";
        let broadcastId = decimalOr(
          currentNetId,
          decimalComplement(subnetMask)
        );
        let firstHostId = fourthOctetValue + "." + "0" + "." + "0" + "." + "1";
        let lastHostId =
          broadcastId.split(".")[0] + "." + "255" + "." + "255" + "." + "254";
        res.push({
          netId: currentNetId,
          firstHostId: firstHostId,
          lastHostId: lastHostId,
          broadcastId: broadcastId,
        });
        fourthOctetValue += noOfHosts / (256 * 256 * 256);
        noOfSubnets--;
      }
    }
    return res;
  };

  // Attach functions to the window object
  window.boolean = {
    toDecimal,
    toIpFromBinary,
    decimalAnd,
    decimalOr,
    decimalComplement,
    toIpFromDecimal,
    createSubnetMask,
    getNetworkAddress,
    getSubnetLength,
    getNumberOfOctetsEffected,
    getNumberOfSubnets,
    getSubnets,
  };
})();
