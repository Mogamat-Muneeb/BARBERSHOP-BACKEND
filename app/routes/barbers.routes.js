const router = require("express").Router();
const Barber = require("../models/barbers");
const { findCustomer } = require("../middleware/finders");
const { findBarber } = require("../middleware/finders");
const verifyToken = require("../middleware/auth.jwt");

router.get("/", async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.send(barbers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/:id", findBarber, async (req, res) => {
  res.send(res.Barber);
});

router.post("/", [verifyToken, findCustomer], async (req, res) => {
  const newBarbers = new Barber({
    barberName: req.body.barberName,
  });
  try {
    await newBarbers.save();
    res.status(200).send({ message: "Saved new barber!" });
  } catch (error) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:barber", [verifyToken, findBarber], async (req, res) => {
  if (req.body.barberName != null) res.barber.barberName = req.body.barberName;
  try {
    const updatedBarber = await res.barber.save();
    res.status(200).send(updatedBarber);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.delete("/:barber", [verifyToken, findBarber], async (req, res) => {
  try {
    await res.barber.remove();
    res.status(200).send({ message: "Barber removed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
