declare module 'graphql-ws' {
    export interface Client {
      // Add any specific methods or properties you're using from the client
    }
  
    export interface ClientOptions {
      url: string;
      connectionParams?: () => Promise<Record<string, unknown>> | Record<string, unknown>;
      // Add other options as needed
    }
  
    export function createClient(options: ClientOptions): Client;
  }
  