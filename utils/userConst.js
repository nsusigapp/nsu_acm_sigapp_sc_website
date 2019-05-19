
// user role ID's saved in DB;
const roleID = {
    USER: 1,
    ADMIN: 2
}

// user status as saved in DB;
const userStatus = {
    ACTIVE: 1,
    IN_ACTIVE: 0
}

const sessStatus = {
    ACTIVE: 1,
    EXPIRED: 0
}

module.exports = {
    roleID,
    userStatus,
    sessStatus
}