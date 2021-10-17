import Detail from './src/Detail'
import './src/index.scss'

Detail.install = app => {
  app.component(Detail.name, Detail)
}

export default Detail
