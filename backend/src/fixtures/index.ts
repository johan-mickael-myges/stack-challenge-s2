import createCategoryFixtures from "./category";
import createproductFixtures from "./product";


export default async function loadFixtures(){
    await createCategoryFixtures();
    await createproductFixtures();
}
