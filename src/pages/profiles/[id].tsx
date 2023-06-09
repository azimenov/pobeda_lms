import type { GetStaticPaths, GetStaticPathsContext, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import { ssgHelper } from '~/server/api/ssgHelper';
import { api } from '~/utils/api';

import ErrorPage from "next/error"
import Link from 'next/link';
import { IconHoverEffect } from '~/components/IconHoverEffect';
import { VscArrowLeft } from "react-icons/vsc";
import ProfileImage from '~/components/ProfileImage';

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ id }) => {

   const { data: profile } =  api.profile.getById.useQuery({ id })

    if( profile == null || profile.name == null) return <ErrorPage statusCode = {404}/>;

  return (<>
    <Head>
        <title>{`${profile.name} pobeda` }</title>
    </Head>
    <header className='sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2'>
        <Link href=".." className= 'mr-2'>
            <IconHoverEffect>
                <VscArrowLeft className = 'h-6 w-6'/>
            </IconHoverEffect>
        </Link>
        <ProfileImage src = {profile.image} className='flex-shrink-0' />
        <div className='ml-2 flex-grow'>
            <h1 className='text-lg font-bold'>{profile.name}</h1>
        </div>
    </header>
    {profile.name}
  </>)
};



export const getStaticPaths: GetStaticPaths = () => {
    return{
        paths: [],
        fallback: "blocking"
    }
}

export async function getStaticProps(context: GetStaticPropsContext <{ id: string}> ) {
    const id = context.params?.id 

    if (id == null) {
        return{
            redirect: {
                destination: "/"
            }
        }
    }

    const ssg = ssgHelper()

    await ssg.profile.getById.prefetch({ id })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        }
    }
}

export default ProfilePage
