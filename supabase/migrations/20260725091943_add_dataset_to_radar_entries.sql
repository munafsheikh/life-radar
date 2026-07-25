alter table public.radar_entries
  add column dataset text not null default 'personal';

alter table public.radar_entries
  drop constraint radar_entries_sector_name_key;

alter table public.radar_entries
  add constraint radar_entries_dataset_sector_name_key unique (dataset, sector, name);

drop index if exists radar_entries_display_order_idx;

create index radar_entries_dataset_display_order_idx
on public.radar_entries (dataset, display_order, sector, ring);
