export class ApiResponse{
     timestamp: string;
     success:boolean;
     constructor(
          public message: string,
          public data: any,
          public path: string,
          public statusCode?: number,
     ){
          this.success = true;
          this.statusCode = statusCode || 200;
          this.message = message;
          this.timestamp = new Date().toISOString();
          this.data = data;
          this.path = path;
     }
}