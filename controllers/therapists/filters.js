const Therapists = require("../../model/therapistSchema");

exports.getAreaOfExpertise = async (req, res) => {
  let expertise = await Therapists.find();
  let ans = [];
  let areaexpertise = expertise.map((e) => {
    return e?.expertise;
  });
  areaexpertise.map((e) => {
    ans = [...ans, ...e];
  });
  let final = [...new Set(ans)];
  res.send(final);
};

exports.getSpeaks = async (req, res) => {
  let expertise = await Therapists.find();
  let ans = [];
  let speaks = expertise.map((e) => {
    return e?.speaks;
  });
  speaks.map((e) => {
    ans = [...ans, ...e];
  });
  let final = [...new Set(ans)];
  res.send(final);
};

exports.getAllTherapists = async (req, res) => {
  let expertise = req.query.expertise.trim();
  let speaks = req.query.speaks.trim();
  let search = req.query.search;

  let query = {};

  if (expertise != "[]") {
    expertise = JSON.parse(expertise);
    query.expertise = { $all: expertise };
  }
  if (speaks != "[]") {
    speaks = JSON.parse(speaks);
    query.speaks = { $all: speaks };
  }
  if (search?.length > 0) {
    query.name = { $regex: search, $options: "i" };
  }

  let therapists = await Therapists.find(query).sort({ name: 1 });

  res.send(therapists);
};
