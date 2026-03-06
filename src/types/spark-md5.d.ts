declare module "spark-md5" {
  export default class SparkMD5 {
    static hash(str: string): string;
    append(str: string): void;
    end(): string;
  }
}
