import {describe, expect, it, test} from 'vitest'
import {render} from "../src";


test('it should render json with jq', () => {
  expect(render(JSON.stringify({'x': '{{.x}}'}), {'x': 1})).toStrictEqual({x: 1});
  expect(render(JSON.stringify({'x': '{{.x // 2}}'}), {'y': 3})).toStrictEqual({x: 2});
  expect(render(JSON.stringify({'x': {'y': 'x'}}), {'y': 3})).toStrictEqual({'x': {'y': 'x'}});
  expect(render(JSON.stringify({'x': {'y': '{{.y}}'}}), {'y': 3})).toStrictEqual({'x': {'y': 3}});
  expect(render(JSON.stringify({'x': {'y': '{{.y+.x[2]}}'}}), {'y': 3, 'x': [0,0,2]})).toStrictEqual({'x': {'y': 5}});
  expect(render(JSON.stringify({'headers':{'Authorization': '{{"Bearer "+.token}}'}}), {'token': "secret"})).toStrictEqual({'headers':{'Authorization': 'Bearer secret'}});
});
