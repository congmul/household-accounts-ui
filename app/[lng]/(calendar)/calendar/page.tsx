import { CalendarPage } from '@/app/ui/calendar-page';

export default async function Index({ params } : { params: { lng : string }}) {
    const { lng } = await params;
    return (<>
        <CalendarPage lng={lng} />
    </>
    );
}