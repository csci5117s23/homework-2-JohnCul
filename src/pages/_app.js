import '@/styles/globals.css'
import 'purecss/build/pure.css'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { ClerkProvider } from '@clerk/nextjs'

export default function App({ Component, pageProps }) {
  return <>
  <ClerkProvider {...pageProps} >
    <div className={styles.topmenu}>
    <div className="topmenu pure-g" id="menu">
        <div className="pure-u-1-4">
          <h2>Todo List</h2>
        </div>

        <div className="pure-u-1-4">
            <Link href="todos">Todos
            </Link>
        </div>
        <div className="pure-u-1-4"><Link href="done">Done
            </Link>
          </div>
        <div className="pure-u-1-4"><p>Categories</p>
        </div>
    </div>
    </div>

    <Component {...pageProps} />

  </ClerkProvider>
  </>
}
