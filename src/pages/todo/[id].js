import { useRouter } from 'next/router'

export default function TodoID() {
    const router = useRouter();
    console.log(router.asPath.split("/")[2]);
}