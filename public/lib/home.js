(function () {
  const form = document.querySelector("#ip-input-form");
  const input = document.querySelector("#ip-input");
  const message = document.querySelector("#ip-validation-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const ip = formData.get("ip");
    const cidr = formData.get("cidr");

    if (window.validateIp(ip)) {
      const subnetMask = window.boolean.createSubnetMask(cidr);
      const networkAddress = window.boolean.getNetworkAddress(ip, subnetMask);
      const subnetLength = window.boolean.getSubnetLength(subnetMask);
      const noOfOctets = window.boolean.getNumberOfOctetsEffected(subnetLength);
      const noOfSubnets = window.boolean.getNumberOfSubnets(
        noOfOctets,
        subnetLength
      );

      console.log("IP: ", ip);
      console.log("Subnet Mask: ", subnetMask);
      console.log("Network Address: ", networkAddress);
      console.log("Subnet Length: ", subnetLength);
      console.log("No. of subnets: ", noOfSubnets);

      let subnetData = window.boolean.getSubnets(
        noOfOctets,
        noOfSubnets,
        subnetLength,
        networkAddress,
        subnetMask
      );
      console.log("Subnets: ", subnetData);

      renderInformationCard(ip, subnetMask, subnetLength, noOfSubnets);
      renderSubnetTable(subnetData);
    } else {
      alert("Please enter a valid IPv4");
      console.log(`${ip} is not a valid IP address.`);
    }
  });

  input.addEventListener("input", (e) => {
    const ip = e.target.value;
    if (ip.length > 0) {
      if (window.validateIp(ip)) {
        message.style.color = "green";
        message.innerHTML = `Valid!`;
      } else {
        message.style.color = "red";
        message.innerHTML = `Invalid!`;
      }
    } else {
      message.style.display = "none";
    }
  });

  const renderInformationCard = (
    ip,
    subnetMask,
    subnetLength,
    numberOfSubnets
  ) => {
    const card = document.getElementById("card");
    card.classList.remove("hidden");
    card.innerText =
      `IP: ${ip}` +
      "\n" +
      `Subnet Mask: ${subnetMask}` +
      "\n" +
      `No. of hosts in a subnet: ${subnetLength}` +
      "\n" +
      `Total subnets: ${numberOfSubnets}`;
  };

  const renderSubnetTable = (subnetData) => {
    let subnetTable = document.getElementById("subnet-table");
    subnetTable.classList.remove("hidden");
    subnetTable.innerHTML = "";

    let thead = document.createElement("thead");
    let thead_tr = document.createElement("tr");
    let td_networkId = document.createElement("td");
    td_networkId.innerText = "Network Id";
    thead_tr.appendChild(td_networkId);
    let td_firstHost = document.createElement("td");
    td_firstHost.innerText = "Usable Hosts";
    thead_tr.appendChild(td_firstHost);
    let td_broadcastId = document.createElement("td");
    td_broadcastId.innerText = "Broadcast Id";
    thead_tr.appendChild(td_broadcastId);
    thead.appendChild(thead_tr);

    let tbody = document.createElement("tbody");
    subnetData.forEach((data) => {
      let tr = document.createElement("tr");
      let td_networkId = document.createElement("td");
      td_networkId.innerText = data.netId;
      tr.appendChild(td_networkId);
      let td_firstHost = document.createElement("td");
      td_firstHost.innerText = data.firstHostId + " ~ " + data.lastHostId;
      tr.appendChild(td_firstHost);
      let td_broadcastId = document.createElement("td");
      td_broadcastId.innerText = data.broadcastId;
      tr.appendChild(td_broadcastId);
      tbody.appendChild(tr);
    });

    subnetTable.appendChild(thead);
    subnetTable.appendChild(tbody);
  };
})();
