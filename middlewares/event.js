
const { events: Event } = require("../models/index");

const loadEvents = async (req, res, next) => {

    try {
        
        const events = await Event.findAll({
            attributes: ["event_id", "event_name", "status", "registered_count"],
            raw: true
        });
    
        res.locals.events = events;
    
        return next();

    } catch (err) {
        
        console.log(err);
    }
}

const getEventById = async (req, res, next) => {

    const eventId = req.params.id;

    try {
        
        const event = await Event.findOne({
            where: {
                event_id: eventId
            }
        });

        res.locals.event = event;

        return next();

    } catch (err) {
        
        console.log(err);
    }

}

module.exports ={
    loadEvents,
    getEventById
}