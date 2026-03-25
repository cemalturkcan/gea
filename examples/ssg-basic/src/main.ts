import { hydrate } from '@geajs/ssg'
import Counter from './views/Counter'
import LiveClock from './views/LiveClock'
import './styles.css'

hydrate({ Counter, LiveClock })
