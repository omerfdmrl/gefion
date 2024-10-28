/**
 * Extend multiple
 * https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance
 * @param {any} baseClass
 * @param  {...any} mixins
 * @returns
 */
module.exports = (baseClass, ...mixins) => {
  class base extends baseClass {
    constructor(...args) {
      super(...args);
      mixins.forEach((mixin) => {
        copyProps(this, new mixin());
      });
    }
  }
  let copyProps = (target, source) => {
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (
          !prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
          )
        )
          Object.defineProperty(
            target,
            prop,
            Object.getOwnPropertyDescriptor(source, prop)
          );
      });
  };
  mixins.forEach((mixin) => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};
