
const fourOFour = (req, res, next) => {
    return res.status(404).render("404");
}

const fiveHundread = (err, req, res, next) => {
    return res.status(err.status || 500).send({ error: err });
};

module.exports = {
    fourOFour,
    fiveHundread,
}