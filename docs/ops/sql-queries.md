# 운영 SQL 쿼리

PgAdmin에서 바로 확인할 수 있는 MVP 운영 쿼리 모음이다.

## 일별 트립 생성 수

```sql
select date_trunc('day', "createdAt")::date as day, count(*) as trips
from "Trip"
where status <> 'deleted'
group by 1
order by 1 desc;
```

## 체크리스트 업데이트율

```sql
select
  count(distinct t.id) as total_trips,
  count(distinct e."tripId") as trips_with_task_updates,
  round(count(distinct e."tripId")::numeric / nullif(count(distinct t.id), 0) * 100, 1) as update_rate
from "Trip" t
left join "AnalyticsEvent" e
  on e."tripId" = t.id
 and e."eventName" = 'task_status_changed'
where t.status <> 'deleted';
```

## 외부 링크 클릭 수

```sql
select
  "properties"->>'type' as type,
  count(*) as clicks
from "AnalyticsEvent"
where "eventName" = 'external_link_click'
group by 1
order by clicks desc;
```

## 공유 링크 조회 수

```sql
select date_trunc('day', "createdAt")::date as day, count(*) as views
from "AnalyticsEvent"
where "eventName" = 'share_page_viewed'
group by 1
order by 1 desc;
```

## 많이 선택된 스키장

```sql
select "resortNameSnapshot", count(*) as trips
from "Trip"
where status <> 'deleted'
group by 1
order by trips desc;
```

## 많이 선택된 렌탈 옵션

```sql
select "selectedRentalOptionId", count(*) as trips
from "Trip"
where "selectedRentalOptionId" is not null
  and status <> 'deleted'
group by 1
order by trips desc;
```

## 가격 출처 클릭 수

```sql
select
  coalesce("properties"->>'sourceName', "properties"->>'type') as source,
  count(*) as clicks
from "AnalyticsEvent"
where "eventName" = 'external_link_click'
  and ("properties"->>'type') in ('price_source', 'trip_price_source', 'resort_lift_price', 'rental_source')
group by 1
order by clicks desc;
```
