interface IObserver {
  [ name : string ]: Function[] | undefined
}

interface ISugar {
  observer: IObserver
}

interface AsyncFunction<T = any>{
  ():Promise<T>
}