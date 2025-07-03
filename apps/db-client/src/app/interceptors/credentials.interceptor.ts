import { HttpInterceptorFn } from '@angular/common/http'

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    withCredentials: true,
  })

  return next(apiReq)
}
