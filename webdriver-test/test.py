from selenium import webdriver
import unittest


class TestLoadsPage(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()
        self.browser.implicitly_wait(2)

    def tearDown(self):
        self.browser.quit()

    def test_will_load(self):
        self.browser.get("http://localhost:3000/")
        self.assertEquals(self.browser.current_url, "http://localhost:3000/",
                          "The browser did not load")
