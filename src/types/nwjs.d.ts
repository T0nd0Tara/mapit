declare namespace NWJS {
  interface App {
    dataPath: string;
  }
}

declare const nw: {
  App: NWJS.App;
};
