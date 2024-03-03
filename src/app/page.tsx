
import dynamic from 'next/dynamic'

const Message = dynamic(
    () => import('../components/authentication_workflow/new'),
    {ssr: false})

const IndexPage = () => {
    return (
        <>
            <Message/>
        </>
    )
}

export default IndexPage


