module.exports = class EZLoad
{
  constructor(defaultContext, defaultLoader)
  {
    this.defaultContext = defaultContext || this;
    this.defaultLoader = defaultLoader || require;
    this.cache = {};
  }

  load(key, path, context, loader)
  {
    context = context || this.defaultContext;
    loader = loader || this.defaultLoader;
    var that = this;

    Object.defineProperty(context, key, {
            get: function()
            {
              if(!(key in that.cache))
              {
                that.cache[key] = loader(path);
              }

              return that.cache[key];
            }
        });
  }
}
