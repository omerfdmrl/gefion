const Config = require("@gefion/config");
const Hook = require("@gefion/hook");
const ViewMaker = require("../Helpers/ViewMaker");

const SettingsConfigs = Config.all();
const ViewData = Object.keys(SettingsConfigs)
  .filter((key) => ["cache", "mq", "mail", "schedule"].includes(key))
  .reduce((obj, key) => {
    obj[key] = SettingsConfigs[key];
    return obj;
  }, {});

var SettingsData = {};

SettingsData.cache = `<div class="row">
            <div class="col-12 text-center" style="">
                <label for="provider" class="form-label mt-3">Provider</label>
                <select v-model="data.cache.provider" id="provider" class="form-select ms-auto me-auto" style="max-width: 350px;">
                  <option v-for="(data, index) in Object.keys(data.cache).filter(c => c !== 'provider')" :value="data">{{ data }}</option>
                </select>
                <small class="form-text text-muted">Default provider for caching</small>
            </div>
          </div>
          <div class="accordion bg-transparent row ps-3 pe-3 mt-3" id="accordionCache"> `;

Object.keys(ViewData.cache).forEach((key) => {
  if (typeof ViewData.cache[key] == "object" && ViewData.cache[key].provider) {
    const template = Hook.do(
      `admin-settings-data-cache-${ViewData.cache[key].provider}`,
      `data.cache.${key}`
    );

    SettingsData.cache += `<div class="col-md-6 accordion-item">
    <h2 class="accordion-header" id="heading-${key}">
      <button class="accordion-button bg-transparent text-capitalize" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${key}" aria-controls="collapse-${key}" aria-expanded="true">${key}</button>
    </h2>`;
    SettingsData.cache += `<div id="collapse-${key}" class="accordion-collapse collapse" aria-labelledby="headings-${key}" data-bs-parent="#accordionCache" style=""><div class="accordion-body">`;
    SettingsData.cache += template;
    SettingsData.cache += `</div></div></div>`;
  }
});

SettingsData.cache += `</div>`;

SettingsData.mail = `<div class="row">
          <div class="col-12 text-center" style="">
              <label for="provider" class="form-label mt-3">Provider</label>
              <select v-model="data.mail.provider" id="provider" class="form-select ms-auto me-auto" style="max-width: 350px;">
                <option v-for="(data, index) in Object.keys(data.mail).filter(c => !['provider', 'templates'].includes(c))" :value="data">{{ data }}</option>
              </select>
              <small class="form-text text-muted">Default provider for caching</small>
          </div>
        </div>
        <div class="accordion bg-transparent row ps-3 pe-3 mt-3" id="accordionMail">`;

Object.keys(ViewData.mail).forEach((key) => {
  if (typeof ViewData.mail[key] == "object" && ViewData.mail[key].provider) {
    const template = Hook.do(
      `admin-settings-data-mail-${ViewData.mail[key].provider}`,
      `data.mail.${key}`
    );

    SettingsData.mail += `<div class="col-md-6 accordion-item">
    <h2 class="accordion-header" id="heading-${key}">
      <button class="accordion-button bg-transparent text-capitalize" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${key}" aria-controls="collapse-${key}" aria-expanded="true">${key}</button>
    </h2>`;
    SettingsData.mail += `<div id="collapse-${key}" class="accordion-collapse collapse" aria-labelledby="headings-${key}" data-bs-parent="#accordionMail" style=""><div class="accordion-body">`;
    SettingsData.mail += template;
    SettingsData.mail += `</div></div></div>`;
  }
});

SettingsData.mail += `</div>`;

SettingsData.mq = `<div class="row">
        <div class="col-12 text-center" style="">
            <label for="provider" class="form-label mt-3">Provider</label>
            <select v-model="data.mq.provider" id="provider" class="form-select ms-auto me-auto" style="max-width: 350px;">
              <option v-for="(data, index) in Object.keys(data.mq).filter(c => c !== 'provider')" :value="data">{{ data }}</option>
            </select>
            <small class="form-text text-muted">Default provider for caching</small>
        </div>
      </div>
      <div class="accordion bg-transparent row ps-3 pe-3 mt-3" id="accordionExample">`;

Object.keys(ViewData.mq).forEach((key) => {
  if (typeof ViewData.mq[key] == "object" && ViewData.mq[key].provider) {
    const template = Hook.do(
      `admin-settings-data-mq-${ViewData.mq[key].provider}`,
      `data.mq.${key}`
    );

    SettingsData.mq += `<div class="col-md-6 accordion-item">
    <h2 class="accordion-header" id="heading-${key}">
      <button class="accordion-button bg-transparent text-capitalize" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${key}" aria-controls="collapse-${key}" aria-expanded="true">${key}</button>
    </h2>`;
    SettingsData.mq += `<div id="collapse-${key}" class="accordion-collapse collapse" aria-labelledby="headings-${key}" data-bs-parent="#accordionMail" style=""><div class="accordion-body">`;
    SettingsData.mq += template;
    SettingsData.mq += `</div></div></div>`;
  }
});

SettingsData.mq += `</div>`;

SettingsData.schedule = `<div class="row">
              <div>
                <label for="scheduled" class="form-label mt-3">Scheduled</label>
                <input v-model="data.schedule.scheduled" class="form-check-input form-control" type="checkbox" id="scheduled" value="true">
                <small class="form-text text-muted">Enables scheduling functionality.</small>
              </div>
              <div>
                <label for="timezone" class="form-label mt-3">Timezone</label>
                <input v-model="data.schedule.timezone" type="text" id="timezone" class="form-control">
                <small class="form-text text-muted">Specifies the timezone for the scheduled tasks.</small>
              </div>
              <div>
                <label for="runOnInit" class="form-label mt-3">Run On Init</label>
                <input v-model="data.schedule.runOnInit" class="form-check-input form-control" type="checkbox" id="runOnInit" value="true">
                <small class="form-text text-muted">Runs the scheduled task immediately on initialization.</small>
              </div>
            </div>`;

const settings = Hook.do("admin-settings", SettingsData);

var template = `
        <div class="mb-4">
            <div class="card">
              <div class="card-header">
                  <nav>
                    <div class="nav nav-tabs border-0" id="nav-tab" role="tablist">
                      <button 
                        :class="[index == 0 ? 'active' : '','nav-link text-capitalize']"
                        v-for="(setting, index) in Object.keys(settings)"
                        :key="index"
                        :id="'nav-'+ setting +'-tab'" 
                        data-bs-toggle="tab" 
                        :data-bs-target="'#nav-'+setting" 
                        type="button" 
                        role="tab" 
                        :aria-controls="'nav-'+setting" 
                        aria-selected="true">
                        {{ setting }}
                      </button>
                    </div>
                  </nav>
              </div>
              <div class="card-body">
                  <div class="tab-content" id="nav-tabContent">

                    `;

Object.keys(settings).forEach((key, index) => {
  template += `<div 
                class="tab-pane fade ${index == 0 ? "active show" : ""}"
                id="nav-${key}"
                role="tabpanel" 
                aria-labelledby="nav-${key}-tab">
              ${settings[key]}
              </div>`;
});

template += `
                  </div>
              </div>
            </div>
        </div>
        <div class="mb-4">
            <div class="row">
              <div>
                  <admin-button callback="save" :then="thenSave" :value="data" class="btn btn-success">Save</admin-button>
              </div>
            </div>
        </div>
    `;

module.exports = ViewMaker({
  template,
  data: {
    settings,
    data: ViewData,
  },
  methods: {
    thenSave: () => {
      this.$toast.success("Saved");
    },
  },
});
