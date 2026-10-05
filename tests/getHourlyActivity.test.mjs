import assert from 'node:assert/strict';
import test from 'node:test';
import { getHourlyActivity } from '../src/features/earthquakes/model/getHourlyActivity.ts';

const end = '2026-10-05T12:30:00.000Z';
const event = (time) => ({ time });

test('returns 24 empty one-hour intervals ending at feed generation time', () => {
  const buckets = getHourlyActivity([], end);

  assert.equal(buckets.length, 24);
  assert.equal(buckets[0].start, Date.parse('2026-10-04T12:30:00Z'));
  assert.equal(buckets[23].end, Date.parse(end));
  assert.ok(buckets.every((bucket) => bucket.count === 0 && bucket.end - bucket.start === 3_600_000));
});

test('counts boundaries once and ignores invalid or out-of-period events', () => {
  const buckets = getHourlyActivity([
    event('2026-10-04T12:29:59.999Z'),
    event('2026-10-04T12:30:00.000Z'),
    event('2026-10-04T13:29:59.999Z'),
    event('2026-10-04T13:30:00.000Z'),
    event(end),
    event('2026-10-05T12:30:00.001Z'),
    event('invalid'),
  ], end);

  assert.equal(buckets[0].count, 2);
  assert.equal(buckets[1].count, 1);
  assert.equal(buckets[23].count, 1);
  assert.equal(buckets.reduce((sum, bucket) => sum + bucket.count, 0), 4);
});

test('equivalent timezone offsets belong to the same interval', () => {
  const buckets = getHourlyActivity([
    event('2026-10-05T12:00:00Z'),
    event('2026-10-05T15:00:00+03:00'),
  ], end);

  assert.equal(buckets[23].count, 2);
});

test('rejects an invalid reference time', () => {
  assert.deepEqual(getHourlyActivity([], 'invalid'), []);
});
