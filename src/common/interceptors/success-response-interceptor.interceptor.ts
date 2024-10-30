import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessResponseInterceptorInterceptor implements NestInterceptor {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((originalData) => {
        const response = context.switchToHttp().getResponse()
        response.setHeader('Content-Type', 'application/json')
        const request = context.switchToHttp().getRequest()

        const { data, meta, isCacheable, type } = originalData
        const hasData = data !== null && data !== undefined && !(Array.isArray(data) && data.length === 0) && !(typeof data === 'object' && Object.keys(data).length === 0)

        if(isCacheable) {
          const lastModified = new Date().toUTCString()
          response.setHeader('Last-Modified', lastModified)
          const ifModifiedSince = request.headers['If-Modified-Since']
          if(ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
            return {
              statusCode: HttpStatus.NOT_MODIFIED,
              message: 'Request successful',
              cacheable: isCacheable,
              timestamp: new Date().toISOString()
            }
          }
        }

        if(meta?.per_page) {
          const { per_page, page} = meta
          response.setHeader('X-Pagination-Page', page)
          response.setHeader('X-Pagination-Limit', per_page)
        }

        let formatData = null;
        if(hasData) {
          formatData = data.map(data => {
            const {id, ...otherAttr} = data
            return {
              type: type,
              id: data.id,
              attributes: { ...otherAttr }
            }
          })
        }

        const result: any = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Request successful',
          data: hasData ? formatData : null,
          cacheable: isCacheable,
          timestamp: new Date().toISOString()
        }

        if(meta) result.meta = meta
        return result;
      })
    );
  }
}
