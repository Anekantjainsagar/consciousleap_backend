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
