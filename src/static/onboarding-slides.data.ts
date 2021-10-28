import SlideA from '@/assets/lottie/onboarding/a_welcome.json'
import SlideB from '@/assets/lottie/onboarding/b_discover.json'
import SlideC from '@/assets/lottie/onboarding/c_subscribe.json'
import SlideD from '@/assets/lottie/onboarding/d_enjoy.json'

export type Slide = {
  id: string
  title: string
  description: string
  animSource: unknown
}

export const slides: Slide[] = [
  {
    id: '001',
    animSource: SlideA,
    title: 'Hi there!',
    description: `You're about to see a lot of quality content. Let us show you how so.fa.dog works.`,
  },
  {
    id: '002',
    animSource: SlideB,
    title: 'Discover',
    description: 'Discover creators that are sharing their passion.',
  },
  {
    id: '003',
    animSource: SlideC,
    title: 'Subscribe',
    description: 'Subscribe and support the ones you love!',
  },
  {
    id: '004',
    animSource: SlideD,
    title: 'Watch',
    description: 'Watch exclusive content and be a part of the community.',
  },
  {
    id: '005',
    animSource: SlideD,
    title: 'Get Started',
    description: 'or skip for now',
  },
]
