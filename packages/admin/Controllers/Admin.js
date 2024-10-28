const Config = require("@gefion/config");
const Hook = require("@gefion/hook");
const paginate = require("../Helpers/paginate");
const pick = require("../Helpers/pick");

const getAdmin = (req, res) => {
  console.log(123);
  res.send(true);
};

const getAdminData = async (req, res) => {
  const SidebarMenu = await Hook.do("admin-sidebar-menu", []);
  const NavbarMenu = await Hook.do("admin-navbar-menu", []);
  res.send({ SidebarMenu, NavbarMenu });
};

const getPage = async (req, res) => {
  const page = await Hook.do(`admin-page-${req.body.path}`, {});
  res.send(page);
};

const doPageAction = async (req, res) => {
  const page = await Hook.do(`admin-page-${req.body.path}`, {});
  var callback;
  if (page.callback) {
    callback = page.callback[req.body.key];
  } else {
    callback = await Hook.do(`admin-page-${req.body.path}-${req.body.key}`);
  }
  if (!callback) res.sendStatus(404);
  await callback(req.body.data);
  res.sendStatus(200);
};

const createData = async (req, res) => {
  const Model = model(
    req.params.model[0].toUpperCase() + req.params.model.slice(1)
  );
  await Model.insert(req.body);

  res.sendStatus(200);
};

const listData = async (req, res) => {
  const Model = model(
    req.params.model[0].toUpperCase() + req.params.model.slice(1)
  );
  const _filter = pick(req.query, (req.query.filter || "").split(","));
  const _options = pick(req.query, ["sortBy", "limit", "page", "search"]);

  const { filter, options } = await Hook.do(
    "admin-data-list-" + req.params.model.toLowerCase(),
    { filter: _filter, options: _options }
  );

  const result = await paginate(Model, filter, options);
  res.send(result);
};

const getData = async (req, res) => {
  const Model = model(
    req.params.model[0].toUpperCase() + req.params.model.slice(1)
  );
  const data = await Model.findOne({ id: req.params.id });
  res.send(data);
};

const setData = async (req, res) => {
  const Model = model(
    req.params.model[0].toUpperCase() + req.params.model.slice(1)
  );

  delete req.body._id;
  await Model.findOneAndUpdate({ id: req.body.id }, req.body);

  res.sendStatus(200);
};

const deleteData = (req, res) => {
  const Model = model(
    req.params.model[0].toUpperCase() + req.params.model.slice(1)
  );
  Model.findOneAndDelete({ id: req.params.id });
  res.sendStatus(200);
};

const uploadFile = async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    const { image } = files;
    const { title } = fields;
    const upload = await adminService.uploadFile(
      image[0],
      fields.title ? title : Date.now()
    );
    res.send(upload.url);
  });
};

module.exports = {
  getAdmin,
  getAdminData,
  getPage,
  doPageAction,
  createData,
  listData,
  getData,
  setData,
  deleteData,
  uploadFile,
};
