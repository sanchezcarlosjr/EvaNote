import {test, vi, expect} from "vitest";



const widgets = {
    toolbarWidgets: [] as  number[],
    addToolbarWidget: (x: number) => {
        widgets.toolbarWidgets.push(x);
    }
}

const dependency = {
    declareWidgets: (obj: typeof widgets) => {
        obj.addToolbarWidget(0);
        return 0;
    }
};

test('install dependency based on its manifest', async () => {
    const spy = vi.spyOn(widgets, 'addToolbarWidget');
    expect(spy.getMockName()).toEqual('addToolbarWidget');
    expect(dependency.declareWidgets(widgets)).toEqual(0);
    expect(spy).toHaveBeenCalledTimes(1);
});


test('x')