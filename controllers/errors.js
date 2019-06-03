
const fourOFour = (req, res, next) => {
    console.log("404?")
    return res.status(404).render("404");
}

const fiveHundread = (err, req, res, next) => {
    console.log("500?")
    return res.status(err.status || 500).send({ error: err });
}

module.exports = {
    fourOFour,
    fiveHundread,
}