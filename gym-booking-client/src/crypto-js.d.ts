declare module "crypto-js" {
  export = CryptoJS;

  namespace CryptoJS {
    function AES(): any;
    namespace AES {
      function encrypt(message: string, key: string): any;
      function decrypt(ciphertext: string, key: string): any;
    }

    function enc(): any;
    namespace enc {
      const Utf8: any;
    }

    function lib(): any;
    namespace lib {
      class WordArray {
        static random(nBytes: number): WordArray;
      }
    }
  }
}
