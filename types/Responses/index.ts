export type ResponseErrorData = {
  error: string;
  notUnique?: true;
  key: string;
};

export class ResponseError {
  message: string;
  key: string;
  notUnique?: true;
  constructor(private error: ResponseErrorData) {
    if (!error.key) {
      const {
        error: _msg,
        key: _key,
        notUnique: _nu,
      } = error.error as unknown as ResponseErrorData;
      this.message = _msg;
      this.key = _key;
      this.notUnique = _nu;
    } else {
      this.message = error.error;
      this.key = error.key;
      this.notUnique = error.notUnique;
    }
  }
}
