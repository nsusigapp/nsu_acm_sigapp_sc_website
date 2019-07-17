        
const listUsers = document.getElementById("listUsers");
const searchUsers = document.getElementById("searchUsers");
const memberApproval = document.getElementById("memberApproval");

const container = document.getElementById("container");
const actionContainer = document.getElementById("actionContainer");

const dateFormat = date => {

    const formatDate = new Date(date);

    const monthName = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthName[formatDate.getMonth()];
    const year = formatDate.getFullYear();
    const day = formatDate.getDate();

    return `${day} ${month}, ${year}`;
}

function userSearchInp(event) {

    axios.get(`/search-user/${event.target.value}`)
        .then(res => {

            if (res.data.fetchedUsers.length === 0) {

                document.getElementById("fetchMsg").textContent = "No users to show!";
                container.innerHTML = "";

            } else {

                document.getElementById("fetchMsg").textContent = "";

                const tableStart = "<table><tr><th>Username</th><th>NSU ID</th><th>NSU Email</th><th>Created At</th><th>Status</th></tr>";
                const tableEnd = "</table>";

                let tableMiddle = "";

                for (let i = 0; i < res.data.fetchedUsers.length; i++) {

                    tableMiddle += "<tr>";
                    tableMiddle += `<td><a href="/profile/${res.data.fetchedUsers[i].u_id}" target="_blank">${res.data.fetchedUsers[i].user_name}</a></td>`;
                    tableMiddle += `<td>${res.data.fetchedUsers[i].nsu_id}</td>`;
                    tableMiddle += `<td>${res.data.fetchedUsers[i].nsu_email}</td>`;
                    tableMiddle += `<td>${dateFormat(res.data.fetchedUsers[i].createdAt)}</td>`;
                    tableMiddle += `<td class="${res.data.fetchedUsers[i].status === 1 ? "active" : "disabled"}">${res.data.fetchedUsers[i].status === 1 ? "Active" : "Pending"}</td>`;
                    tableMiddle += "</tr>";
                }

                const table = tableStart + tableMiddle + tableEnd;

                container.innerHTML = table;
            }
        })
        .catch(err => console.log(err));
}

function approveUser(event) {

    event.preventDefault();

    axios.post(`/approve-user/${event.target.dataset.uid}`, {
        nsu_id: event.target.dataset.nsu_id
    })
        .then(res => {

            if (res.data.success) {

                event.target.textContent = "Approved!!!";

            } else {

                event.target.textContent = "error";
            }

        })
        .catch(err => console.log(err));
}

searchUsers.addEventListener("click", function(event) {

    event.preventDefault();

    actionContainer.innerHTML = "<input onkeyup='userSearchInp(event)' class='admin-search-users' placeholder='Search By Username | NSU ID | NSU Email'>";
    document.getElementById("fetchMsg").textContent = "";
    container.innerHTML = "";
    
});

listUsers.addEventListener("click", function(event) {
    
    event.preventDefault();
    
    actionContainer.innerHTML = "";

    axios.get("/get-all-users")
        .then(res => {

            if (res.data.fetchedUsers.length === 0) {
                
                document.getElementById("fetchMsg").textContent = "No users to show!";
                container.innerHTML = "";

            } else {

                document.getElementById("fetchMsg").textContent = "";

                const tableStart = "<table><tr><th>Username</th><th>NSU ID</th><th>NSU Email</th><th>Created At</th><th>Status</th></tr>";
                const tableEnd = "</table>";
                
                let tableMiddle = "";

                for (let i = 0; i < res.data.fetchedUsers.length; i++) {
                    
                    tableMiddle += "<tr>";
                    tableMiddle += `<td><a href="/profile/${res.data.fetchedUsers[i].u_id}" target="_blank">${res.data.fetchedUsers[i].user_name}</a></td>`;
                    tableMiddle += `<td>${res.data.fetchedUsers[i].nsu_id}</td>`;
                    tableMiddle += `<td>${res.data.fetchedUsers[i].nsu_email}</td>`;
                    tableMiddle += `<td>${dateFormat(res.data.fetchedUsers[i].createdAt)}</td>`;
                    tableMiddle += `<td class="${res.data.fetchedUsers[i].status === 1 ? "active" : "disabled"}">${res.data.fetchedUsers[i].status === 1 ? "Active" : "Pending"}</td>`;
                    tableMiddle += "</tr>";
                }

                const table = tableStart + tableMiddle + tableEnd;

                container.innerHTML = table;
            }
        })
        .catch(err => console.log(err));
});

memberApproval.addEventListener("click", function(event) {

    event.preventDefault();
    
    actionContainer.innerHTML = "";

    axios.get("/pending-users")
        .then(res => {
            
            if (res.data.pendingUsers.length === 0) {
                
                document.getElementById("fetchMsg").textContent = "No users to show!";
                container.innerHTML = "";

            } else {

                document.getElementById("fetchMsg").textContent = "";

                const tableStart = "<table><tr><th>Username</th><th>NSU ID</th><th>NSU Email</th><th>Created At</th><th>Action</th></tr>";
                const tableEnd = "</table>";
                
                let tableMiddle = "";

                for (let i = 0; i < res.data.pendingUsers.length; i++) {
                    
                    tableMiddle += "<tr>";
                    tableMiddle += `<td><a href="/profile/${res.data.pendingUsers[i].u_id}" target="_blank">${res.data.pendingUsers[i].user_name}</a></td>`;
                    tableMiddle += `<td>${res.data.pendingUsers[i].nsu_id}</td>`;
                    tableMiddle += `<td>${res.data.pendingUsers[i].nsu_email}</td>`;
                    tableMiddle += `<td>${dateFormat(res.data.pendingUsers[i].createdAt)}</td>`;
                    tableMiddle += `<td><a onclick="approveUser(event)" id="approveUser" href="#" data-uid="${res.data.pendingUsers[i].u_id}" data-nsu_id="${res.data.pendingUsers[i].nsu_id}" class="dark-btn">Approve</a></td>`;
                    tableMiddle += "</tr>";
                }

                const table = tableStart + tableMiddle + tableEnd;

                container.innerHTML = table;
            }

        })
        .catch(err => console.log(err));
});