import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocPersonal } from './doc-personal.enum';
import { DocRepository } from './doc.repository';
import { DocsService } from './docs.service';
import { GetDocsFilterDto } from './dto/get-docs-filter.dto';

const mockUser = { id: 8, username: "Test user" };

const mockDocRepository = () => ({
  getDocs: jest.fn(),
  findOne: jest.fn(),
  createDoc: jest.fn(),
  delete: jest.fn(),
});

describe('DocsService', () => {
  let docsService;
  let docRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DocsService,
        { provide: DocRepository, useFactory: mockDocRepository }
      ],
    }).compile();

    docsService = await module.get<DocsService>(DocsService);
    docRepository = await module.get<DocRepository>(DocRepository);
  });

  describe('getDocs', () => {
    it('gets all docs from the repository', async () => {
      docRepository.getDocs.mockResolvedValue('someValue');

      expect(docRepository.getDocs).not.toHaveBeenCalled();

      const filters: GetDocsFilterDto = { personal: DocPersonal.TRUE, search: "Some search query" };

      const result = await docsService.getDocs(filters, mockUser);
      
      expect(docRepository.getDocs).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getDocById', () => {
    it('calls docRepository.findOne() and successfuly retrieve and return the doc', async () => {
      const mockDoc = { title: 'Test title', content: 'Test content' };

      docRepository.findOne.mockResolvedValue(mockDoc);

      const result = await docsService.getDocById(1, mockUser);

      expect(result).toEqual(mockDoc);

      expect(docRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        }
      });
    });

    it('throws an error as doc is not found', () => {
      docRepository.findOne.mockResolvedValue(null);

      expect(docsService.getDocById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createDoc', () => {
    it('calls docRepository.create() and returns the result', async () => {
      docRepository.createDoc.mockResolvedValue('SomeDoc');

      const createDocDto = { title: 'Doc title', content: 'Doc content' };
      
      expect(docRepository.createDoc).not.toHaveBeenCalled();

      const result = await docsService.createDoc(createDocDto, mockUser);

      expect(docRepository.createDoc).toHaveBeenCalledWith(createDocDto, mockUser);
      expect(result).toEqual('SomeDoc');
    });
  });

  describe('deleteDoc', () => {
    it('calls docRepository.deleteDoc() to delete a doc', async () => {
      docRepository.delete.mockResolvedValue({ affected: 1 });
    
      expect(docRepository.delete).not.toHaveBeenCalled();

      await docsService.deleteDoc(1, mockUser);

      expect(docRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as doc is not found for deleting', () => {
      docRepository.delete.mockResolvedValue({ affected: 0 });

      expect(docsService.deleteDoc(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateDocPersonal', () => {
    it('updates a doc personal', async () => {
      const save = jest.fn();

      docsService.getDocById = jest.fn().mockResolvedValue({
        personal: DocPersonal.TRUE,
        save,
      });

      expect(docsService.getDocById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await docsService.updateDocPersonal(1, DocPersonal.FALSE, mockUser);
      expect(docsService.getDocById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.personal).toEqual(DocPersonal.FALSE);
    });
  });
});