module.exports = {
  template: `
      <div class="mb-4">
        <div class="card shadow">
          <div class="card-header d-flex justify-content-between">
            <label class="ms-2 d-flex">
              <span class="mt-auto mb-auto">Show</span>
              <select class="form-select ms-2 me-2">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span class="mt-auto mb-auto">Entries</span>
            </label>
            <label class="d-flex">
              <span class="mt-auto mb-auto me-2"> Search: </span>
              <input type="text" class="form-control" placeholder="Search">
            </label>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="card" style="width: 18rem;">
                  <img src="https://picsum.photos/700/550" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  data: {},
  methods: {},
  style: `
        .dynamic-component {
          font-size: 20px;
          color: blue;
          padding: 10px;
          border: 1px solid black;
          border-radius: 5px;
          background-color: lightgray;
        }
    `,
};
