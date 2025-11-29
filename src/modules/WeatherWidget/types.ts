export declare namespace IApi {
    export namespace Weather {
      export interface Response {
        data : {}
      }
    }
    
    export namespace CityList {  
      export interface Response {
        data : []
      }
    }
  }
  
export declare namespace IEntity {
    export interface City {
        id: string
        name: string
        country: string
        lat: number
        lon: number
    }
    
    export interface Weather {
        cityId: string
        cityName: string
        country: string
        temp: number
        feelsLike: number
        description: string
        humidity: number
        pressure: number
        windSpeed: number
        windDeg: number
        dewPoint: number
        visibility: number
        icon: string
    }
      
}

