import { Button } from '@/components/ui/button'
import styles from './styles.module.css'

export default function Login() {
	return (
		<section>
			<h1 className={styles.some}>Login</h1>
			<p>Login page</p>
			<Button>Login</Button>
		</section>
	)
}
